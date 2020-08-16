class Event < ApplicationRecord
  belongs_to :user
  has_many :guests
  has_many :questions
  
  validates :name, presence: true
  validates :description, presence: true
  validates :passcode, presence: true
  validates :start, presence: true
  
end
