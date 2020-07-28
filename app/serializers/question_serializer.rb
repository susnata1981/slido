class QuestionSerializer
  include FastJsonapi::ObjectSerializer
  
  attributes :content, :status, :created_at, :updated_at
  belongs_to :guest, serializer: GuestSerializer
  has_many :votes, serializer: VoteSerializer
end
