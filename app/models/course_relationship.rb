class CourseRelationship < ApplicationRecord
  belongs_to :course
  belongs_to :tourist_spot
end
