class TouristSpot < ApplicationRecord
  has_many :course_relationships
  has_many :courses, through: :course_relationships
  mount_uploader :picture, PictureUploader
  paginates_per 10
  geocoded_by :location
  after_validation :geocode
end
