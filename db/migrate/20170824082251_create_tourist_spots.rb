class CreateTouristSpots < ActiveRecord::Migration[5.1]
  def change
    create_table :tourist_spots do |t|
      t.string :name
      t.text :description
      t.string :location

      t.timestamps
    end
  end
end
