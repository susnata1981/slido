# Admin functionality
class AdminController < ApplicationController
#  before_action :authenticate_user!

  def index
    puts '*'*50
    @users = User.all
    puts @users
  end

  def is_logged_in?
    puts "is logged in user #{current_user}"
    if (current_user.nil?) 
      render json: { user: nil }, status: 401
      return
    end
    render json: { user: current_user }, status: 200 
  end

  def is_logged_in_as_guest?
    if session[:guest].nil?
      render json: {}, status: 401
      return
    end
    render json: { guest: session[:guest] }, status: 200
  end
end
