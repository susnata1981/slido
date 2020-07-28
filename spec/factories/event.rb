
FactoryBot.define do
  factory :event do |e|
    sequence(:name) {|n| "Event #{n}"}
    start  { 10.days.from_now }
    passcode { 'banana' }
  end
end
