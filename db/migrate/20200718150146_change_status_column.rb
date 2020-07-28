class ChangeStatusColumn < ActiveRecord::Migration[6.0]
  def change
    change_column :questions, :status, 'integer USING CAST(status AS integer)'
  end
end
