require 'rails_helper'

RSpec.describe ::V1::QuestionsController, type: :controller do
  login_user
  let(:event) { create(:event, user: subject.current_user) }
  let(:guest) { create(:guest, event: event) }
  let(:question) { create(:question, guest: guest, event: event) }

  describe 'Get question' do
    # let(:vote) { create(:vote, type: Vote.up, guest: guest, question: question) }

    it 'all' do
      guest1 = create(:guest, event: event)
      # post :join, params: { join: { eventName: event.name, passcode: 'banana', firstname: guest1.firstname, lastname: 'Basak' }}
      vote1 = create(:vote, vote_type: "up", guest: guest, question: question)
      vote2 = create(:vote, vote_type: "down", guest: guest, question: question)
      get :index, params: {event_id: event.id }

      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"][0]["relationships"]).to include("votes", "guest")
      puts parsed_body
    end

    it 'by id' do
      get :show, params: { id: question.id, event_id: event.id }
      expect(response).to have_http_status(200)
    end

    it 'returns guests' do
      get :show, params: { id: question.id, event_id: event.id }
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"]["relationships"]).to include("guest")
    end

    it 'returns votes' do
      vote = create(:vote, vote_type: "up", guest: guest, question: question)
      get :show, params: { id: question.id, event_id: event.id }
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"]["relationships"]).to include("votes")
    end
  end

  describe 'vote question' do
    it 'vote before joining event' do
      post :vote, params: { id: question.id, guest_id: guest.id, vote_type: 'up' }
      expect(response).to have_http_status(401)
    end

    it 'up vote' do
      post "/events/join", params: { join: { eventName: event.name, passcode: 'banana', firstname: guest.firstname, lastname: 'Basak' }}
      post :vote, params: { id: question.id, guest_id: guest.id, vote_type: 'up' }
      expect(response).to have_http_status(200)

      get :show, params: { id: question.id, event_id: event.id }
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body["data"]["relationships"]).to include('guest', 'votes')
      votes = parsed_body["included"].select{ |e| e["type"] == "vote" }
      expect(votes.length).to be(1)
      vote = votes[0]
      expect(vote["attributes"]["vote_type"]).to eq("up")
    end

    it 'multiple up votes' do
      guest1 = create(:guest, event: event)
      post :vote, params: { id: question.id, guest_id: guest1.id, vote_type: 'up' }

      guest2 = create(:guest, event: event)
      post :vote, params: { id: question.id, guest_id: guest2.id, vote_type: 'up' }

      get :show, params: { id: question.id, event_id: event.id }
      expect(response).to have_http_status(200)

      votes = JSON.parse(response.body)['included'].select{ |e| e['type'] == 'vote' }
      expect(votes.length).to be(2)
      expect(votes[0]['attributes']['vote_type']).to eq('up')
      expect(votes[1]['attributes']['vote_type']).to eq('up')
    end

    it 'multiple up/down votes' do
      guest1 = create(:guest, event: event)
      post :vote, params: { id: question.id, guest_id: guest1.id, vote_type: 'down' }

      guest2 = create(:guest, event: event)
      post :vote, params: { id: question.id, guest_id: guest2.id, vote_type: 'down' }

      guest3 = create(:guest, event: event)
      post :vote, params: { id: question.id, guest_id: guest3.id, vote_type: 'up' }

      get :show, params: { id: question.id, event_id: event.id }
      expect(response).to have_http_status(200)

      votes = JSON.parse(response.body)['included'].select{ |e| e['type'] == 'vote' }
      expect(votes.length).to be(3)
      expect(votes[0]['attributes']['vote_type']).to eq('down')
      expect(votes[1]['attributes']['vote_type']).to eq('down')
      expect(votes[2]['attributes']['vote_type']).to eq('up')
    end

  end

end
