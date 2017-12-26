class CreateCourseRelationships < ActiveRecord::Migration[5.1]
  def change
    create_table :course_relationships do |t|
      t.integer :course_id
      t.integer :tourist_spot_id
      t.integer :spot_order

      t.timestamps
    end
    add_index :course_relationships, :course_id
    add_index :course_relationships, :tourist_spot_id
    add_index :course_relationships, [:course_id, :tourist_spot_id], unique: true
  end
end
