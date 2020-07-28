module V1
  # Controller for handling questions
  class QuestionsController < ApplicationController
    before_action :guest_joined_event?
    before_action :validate_status_params, only: [:update_status]
    skip_before_action :verify_authenticity_token

    def index
      @filter = params[:filter]
      if @filter.nil?
        @questions = Question.where(event_id: params[:event_id], status: 1)
      else
        @questions = Question.where(event_id: params[:event_id])
      end
      render json: QuestionSerializer.new(@questions, include: [:guest, :votes]).serializable_hash, status: 200
    end

    def show
      @question = Question.find(params[:id])
      render json: QuestionSerializer.new(@question, include: [:guest, :votes]).serializable_hash, status: 200
    end

    def vote
      @question = Question.find(params[:id])
      @guest = Guest.find(session[:guest]['id'])
      @vote = Vote.where(question_id: @question.id, guest_id: @guest.id, vote_type: params[:vote_type]).first
      if @vote
        @vote.destroy
        @question = Question.find(params[:id])
        render json: QuestionSerializer.new(@question, include: [:votes]).serializable_hash, status: :ok
        return
      end

      @vote = Vote.new(guest: @guest, question: @question, vote_type: params[:vote_type])
      @vote.save!
      render json: QuestionSerializer.new(@question, include: [:votes]).serializable_hash, status: :ok
    end

    def update_status 
      @question = Question.find(params[:id])
      if @question.event.user.id != current_user.id
        render json: {}, status: 401
        return
      end

      @question.update!(status: params[:status])
      render json: QuestionSerializer.new(@question, include: [:votes]).serializable_hash, status: :ok
    end

    def create
      @question = Question.new(question_params)
      puts question_params
      @question.guest = Guest.find(session[:guest]["id"])
      @question.event = Event.find(session[:event]["id"])
      @question.status = 'pending_review'
      if @question.save
        puts QuestionSerializer.new(@question).serializable_hash
        render json: QuestionSerializer.new(@question).serializable_hash, status: :ok
      else
        puts @question.errors.messages
        render json: { success: false }, status: 500
      end
    end

    private
    def question_params
      params.require(:question).permit(:content)
    end

    def guest_joined_event?
      session[:guest].blank?
    end

    def validate_status_params
      return false unless params[:status].present? && 
        ['pending_reivew', 'approved', 'rejected'].include?(params[:status])
    end
  end
end
