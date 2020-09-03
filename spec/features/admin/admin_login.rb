require 'spec_helper'

RSpec.describe 'Administrator features', type: :feature do
  before do
    Rails.application.env_config["devise.mapping"] = Devise.mappings[:user] # If using Devise
    Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google_oauth2]
  end

  it 'can access home page with right credential' do
    visit('/admin')
    debugger
    click_link('Sign in with Google')

    expect(page).to have_content('JOIN EVENTS')
    expect(page).to have_content('ADMINISTRATOR')
  end

  xit 'can create an event' do
    visit('/admin')
    click_link('Sign in with Google')
   
    click_link('ADMINISTRATOR')
    click_link('header-menu')
    sleep(10)
  end

  #def stub_omniauth
  #  # first, set OmniAuth to run in test mode
  #  OmniAuth.config.test_mode = true
  #  # then, provide a set of fake oauth data that
  #  # omniauth will use when a user tries to authenticate:

  #  OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new({
  #      provider: "google",
  #      uid: "12345678910",
  #      info: {
  #        email: "susnata@gmail.com",
  #        first_name: "Susnata",
  #        last_name: "Basak"
  #      },
  #      credentials: {
  #        token: "abcdefg12345",
  #        refresh_token: "12345abcdefg",
  #        expires_at: DateTime.now,
  #      }
  #  })
  #end
end
