class CreateVotes < ActiveRecord::Migration[6.0]
  def change
    create_table :votes do |t|
      t.references :guest, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
