class TouristSpot < ApplicationRecord
  mount_uploader :picture, PictureUploader
  paginates_per 10
  geocoded_by :location
  after_validation :geocode
end
