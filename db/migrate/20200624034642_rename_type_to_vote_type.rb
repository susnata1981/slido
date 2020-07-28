class RenameTypeToVoteType < ActiveRecord::Migration[6.0]
  def change
    rename_column :votes, :type, :vote_type
  end
end
