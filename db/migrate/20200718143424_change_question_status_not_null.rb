class ChangeQuestionStatusNotNull < ActiveRecord::Migration[6.0]
  def change
    change_column :questions, :status, :string, :null => false
  end
end
