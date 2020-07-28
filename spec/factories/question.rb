FactoryBot.define do
  factory :question do |f|
    content { "What is your name?" }
    status { "approved" }
    up { 3 }
    down { 4 }
    guest
  end
end
