module V1
  # Guest controller methods
  class GuestController < ApplicationController

    def isGuestUserLoggedIn
      if session[:guest].blank? || session[:event].blank?
        render json: { loggedIn: false }
      else
        render json: { guest: session[:guest], event: session[:event] }, status: :ok
      end
    end

    def get
      @guest = Guest.find(params[:id])
      if @guest.blank?
        render json: { error: true, message: "Invalid guest id:"+params[:id]}
      end
      render json: @guest, status: :ok
    end

  end
end