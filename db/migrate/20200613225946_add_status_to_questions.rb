class AddStatusToQuestions < ActiveRecord::Migration[6.0]
  def change
    add_column :questions, :status, :integer
  end
end
