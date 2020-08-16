module V1
  # Events controller
  class EventsController < ApplicationController
    before_action :authenticate_user!, only: [:index, :create]
    skip_before_action :verify_authenticity_token

    def index
      @events = Event.where(user_id: current_user.id)
      render json: @events
    end

    def show
      if current_user.nil? && user_not_joined_event? 
        render json: { isLoggedIn: false }, status: 401
        return
      end
      @event = Event.find(params[:id])
      render json: EventSerializer.new(@event, include: [:guests, :questions]).serializable_hash, status: 200
    end

    def create
      @event = Event.new(event_params)
      if @event.name.nil? || @event.description.nil? || @event.start.nil?
        render json: { success: false }, status: 400
        return
      end

      @event.user = current_user

      if @event.save
        render json: { success: true, event: @event }
      else
        render json: { error: true }
      end
    end

    def update
      @event = Event.find(params["id"])
      updated_event = event_params
      puts updated_event
      @event.update!(
        name: updated_event["name"], 
        description: updated_event["description"], 
        passcode: updated_event["passcode"], 
        start: updated_event["start"])

      render json: @event, status: 200
    end

    def destroy
      Event.delete(params[:id])
      render json: { success: true }, status: :ok
    end

    def join
      pm = join_params
      @event = Event.where(name: pm[:eventName]).first

      if @event.passcode == pm[:passcode]
        @guest = Guest.where(firstname: pm[:firstname], lastname: pm[:lastname], event_id: @event.id).first

        unless @guest
          @guest = Guest.new(firstname: pm[:firstname], lastname: pm[:lastname], event_id: @event.id)
          unless @guest.save
            render json: { success: false, error: 'failed save guest user' }
          end
        end
        session[:guest] = @guest
        session[:event] = @event

        render json: EventSerializer.new(@event).serializable_hash, status: 200

      else
        render json: { success: false }, status: 401
      end
    end

    def get_guest
      if !session[:guest]
        render json: { error: true, message: 'Guest not logged in' }, status: 401
        return
      end

      render json: GuestSerializer.new(session[:guest]).serializable_hash, status: 200
    end

    private

    def event_params
      params.require(:event).permit(:name, :description, :start, :passcode)
    end

    def join_params
      params.require(:join).permit(:eventName, :passcode, :firstname, :lastname)
    end

  end
end
