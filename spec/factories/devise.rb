FactoryBot.define do
  factory :user do |f|
    # id {1010}
    f.sequence(:email) {|n| "test#{n}@gmail.com"}
    password {"qwerty"}
  end
end

# FactoryBot.define do
#   factory :user do
#     id {1}
#     email {"test@user.com"}
#     password {"qwerty"}
#     # Add additional fields as required via your User model
#   end

  # Not used in this tutorial, but left to show an example of different user types
  # factory :admin do
  #   id {2}
  #   email {"test@admin.com"}
  #   password {"qwerty"}
  #   admin {true}
  # end
# end