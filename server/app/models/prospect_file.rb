class ProspectFile < ApplicationRecord
  alias_attribute :email_index, :users_id
  validates_presence_of :file, :users_id
  has_one_attached :file
end
