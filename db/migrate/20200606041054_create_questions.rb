class CreateQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :questions do |t|
      t.string :content
      t.references :guest, null: false, foreign_key: true
      t.integer :up
      t.integer :down
      t.string :status

      t.timestamps
    end
  end
end
