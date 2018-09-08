class AddRankToTouristSpots < ActiveRecord::Migration[5.1]
  def change
    add_column :tourist_spots, :rank, :integer
  end
end
