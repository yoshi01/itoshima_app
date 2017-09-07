class TouristSpot < ApplicationRecord
  mount_uploader :picture, PictureUploader
  paginates_per 10
end
