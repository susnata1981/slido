FactoryBot.define do
  factory :vote do |f|
    vote_type { "up" }
    guest
    question
  end
end
