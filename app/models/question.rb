class Question < ApplicationRecord
  belongs_to :guest
  belongs_to :event
  has_many :votes

  #scope :all, -> { where(status >= 0 ) }

  enum status: {pending_review:0, approved:1, rejected:2, completed:3}

  validates :content, presence: true
  validates :status, presence: true
end
