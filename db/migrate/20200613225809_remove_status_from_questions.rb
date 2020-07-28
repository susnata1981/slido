class RemoveStatusFromQuestions < ActiveRecord::Migration[6.0]
  def change
    remove_column :questions, :status, :string
  end
end
