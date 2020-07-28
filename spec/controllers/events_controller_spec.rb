require 'rails_helper'

RSpec.describe ::V1::EventsController, type: :controller do

  login_user

  describe 'Get listing' do
    it 'returns successful response' do
      get :index
      expect(response).to have_http_status(200)
    end

    it 'returns all events' do
      event = create(:event, user: subject.current_user)
      get :index
      expect(assigns(:events)).to eq([event])
    end
  end

  describe 'Show event' do
    let(:event)  { create(:event, user: subject.current_user) }
    let(:guest)  { create(:guest, event: event) }
    let(:question) { create(:question, guest: guest) }
  
    it 'returns user not logged in' do
      get :show, params: { id: event.id }
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["isLoggedIn"]).to be(false)
    end

    it 'returns user logged in' do
      post :join, params: { join: { eventName: event.name, passcode: 'banana', firstname: 'Sean', lastname: 'Basak' }}
      get :show, params: { id: event.id }
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"]["relationships"].keys).to include("guests", "questions")
    end

    it 'by id' do
      post :join, params: { join: { eventName: event.name, passcode: 'banana', firstname: 'Sean', lastname: 'Basak' }}
      get :show, params: { id: event.id }
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"]["relationships"].keys).to include("guests", "questions")
    end
  end

  describe 'Create event' do
    it 'returns successful response' do
      attrs = attributes_for(:event)
      post :create, params: { event: attrs }
      expect(response).to have_http_status(200)
    end
  end

  describe 'Destroy event' do
    it 'returns success after removing event' do
      event = create(:event, user: subject.current_user)
      post :destroy, params: { id: event.id }
      expect(response).to have_http_status(200)
    end

    it 'returns success after removing event' do
      event = create(:event, user: subject.current_user)
      post :destroy, params: { id: event.id }
      
      get :index
      expect(assigns(:events)).to eq([])
    end
  end

  describe 'Join event' do
    it 'Using invalid credential' do
      event = create(:event, user: subject.current_user)
      guest = create(:guest, event: event)
      post :join, params: {join: { 
        eventName: event[:name], 
        passcode: "wrong", 
        firstname: guest[:firstname],
        lastname: guest[:lastname]
      }}  
      expect(response).to have_http_status(401)
    end

    it 'Existing guest using valid credential' do
      event = create(:event, user: subject.current_user)
      guest = create(:guest, event: event)
      post :join, params: {join: { 
        eventName: event[:name], 
        passcode: event[:passcode],
        firstname: guest[:firstname],
        lastname: guest[:lastname]
      }}
      expect(session[:guest]).to eq(guest)
      expect(session[:event]).to eq(event)
      expect(response).to have_http_status(200)
    end

    it 'Double login using valid credential' do
      event = create(:event, user: subject.current_user)
      guest = create(:guest, event: event, firstname: 'Guest')
      post :join, params: {join: { 
        eventName: event[:name], 
        passcode: event[:passcode],
        firstname: guest[:firstname],
        lastname: guest[:lastname]
      }}
      expect(session[:guest]).to eq(guest)
      expect(session[:event]).to eq(event)
      expect(response).to have_http_status(200)

      post :join, params: {join: { 
        eventName: event[:name], 
        passcode: event[:passcode],
        firstname: guest[:firstname],
        lastname: guest[:lastname]
      }}
      expect(session[:guest]).to eq(guest)
      expect(session[:event]).to eq(event)
      expect(response).to have_http_status(200)
    end

    it 'New guest joining event' do
      event = create(:event, user: subject.current_user)
      guest = build(:guest, event: event, firstname: 'Adi', lastname: 'Basak')
      post :join, params: {join: {
        eventName: event[:name],
        passcode: event[:passcode],
        firstname: guest[:firstname],
        lastname: guest[:lastname]
      }}
      expect(session[:guest][:firstname]).to eq('Adi')
      expect(session[:guest][:lastname]).to eq('Basak')
      expect(session[:event]).to eq(event)
      expect(response).to have_http_status(200)
    end
  end
end
