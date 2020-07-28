class Guest < ApplicationRecord
  has_many :questions
  belongs_to :event

end
