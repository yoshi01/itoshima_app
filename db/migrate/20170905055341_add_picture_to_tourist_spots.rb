class AddPictureToTouristSpots < ActiveRecord::Migration[5.1]
  def change
    add_column :tourist_spots, :picture, :string
  end
end
