class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  # replace with your authenticate method
  # skip_before_action :authenticate_user!

  def google_oauth2
    auth = request.env["omniauth.auth"]
    user = User.where(provider: auth["provider"], uid: auth["uid"])
            .first_or_initialize(email: auth["info"]["email"])
    user.name ||= auth["info"]["name"]
    user.save!

    # user.remember_me = true
    sign_in(:user, user)

    redirect_to after_sign_in_path_for(user)
  end

  def logout
    puts "Current user is #{current_user}"
    sign_out current_user
    session = {}
    puts "Current user is #{current_user}"
    redirect_to home_page_path
  end

  def is_logged_in?
    puts 'Current user = #{current_user}'
    current_user
  end
end
