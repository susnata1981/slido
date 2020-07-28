class Vote < ApplicationRecord
  belongs_to :guest
  belongs_to :question

  enum vote_type: { up: "up", down: "down" }
end
