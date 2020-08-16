class Administrators < ActiveRecord::Migration[6.0]
  def change
    create_table :administrators do |t|
      t.string :email
    end
  end
end
