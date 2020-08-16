class AddDescriptionToEvents < ActiveRecord::Migration[6.0]
  def change
    add_column :events, :description, :string, null:false
  end
end
