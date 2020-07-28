class VoteSerializer
  include FastJsonapi::ObjectSerializer

  attributes :guest_id, :vote_type, :question_id, :created_at, :updated_at
end
