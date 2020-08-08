require 'rails_helper'

RSpec.describe 'Home features' do
  it 'display the links' do
    puts 'Running capybara test'
    visit('/admin')
    expect(page).to have_content('Admin')
  end

end

