class EventSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :name, :passcode, :start
  has_many :guests, serializer: GuestSerializer
  has_many :questions, serializer: QuestionSerializer
end
