class GuestSerializer
  include FastJsonapi::ObjectSerializer

  attributes :firstname, :lastname
  # belongs_to :event, serializer: EventSerializer
end
