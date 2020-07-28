class V1::ThingsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: {
      things: [{
        name: 'some_things',
        guid: 'AAAA-1111-BBBB-2222'
      }]
    }.to_json
  end

end
