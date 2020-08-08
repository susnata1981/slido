require 'rails_helper'

RSpec.describe 'Home features', type: :feature do
  before do
    #Rails.application.env_config["devise.mapping"] = Devise.mappings[:user] # If using Devise
    Rails.application.env_config["omniauth.auth"] = OmniAuth.config.mock_auth[:google]
  end

  describe 'index page' do
    let(:sleep_duration) { 2 }

    it 'display the links' do
      stub_omniauth
      puts 'Running capybara test'
      visit('/admin')
      sleep sleep_duration 
      expect(page).to have_content('Admin')
      find('a', text: /Sign in/).click

      sleep sleep_duration
      expect(page).to have_link('Join Event')
      expect(page).to have_link('Admin')

      click_link('Admin')
      expect(page).to have_content('Events')
    end
  end

  def stub_omniauth
    # first, set OmniAuth to run in test mode
    OmniAuth.config.test_mode = true
    # then, provide a set of fake oauth data that
    # omniauth will use when a user tries to authenticate:

    OmniAuth.config.mock_auth[:google] = OmniAuth::AuthHash.new({
        provider: "google",
        uid: "12345678910",
        info: {
          email: "jesse@mountainmantechnologies.com",
          first_name: "Jesse",
          last_name: "Spevack"
        },
        credentials: {
          token: "abcdefg12345",
          refresh_token: "12345abcdefg",
          expires_at: DateTime.now,
        }
    })
  end
end
