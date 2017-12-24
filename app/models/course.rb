class Course < ApplicationRecord
  has_many :course_relationships
  has_many :tourist_spots, through: :course_relationships
end
