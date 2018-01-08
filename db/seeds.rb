require "csv"

CSV.foreach('db/spots_data.csv') do |row|
  TouristSpot.create(:name => row[0], :location => row[1], :description => row[2])
end

for i in 1..38 do
  TouristSpot.find(i).update_column(:rank, i)
end
