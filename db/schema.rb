# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_07_18_150146) do

  create_table "events", force: :cascade do |t|
    t.string "name"
    t.datetime "start"
    t.string "passcode"
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_events_on_user_id"
  end

  create_table "guests", force: :cascade do |t|
    t.string "firstname"
    t.string "lastname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "event_id", null: false
    t.index ["event_id"], name: "index_guests_on_event_id"
  end

  create_table "questions", force: :cascade do |t|
    t.string "content"
    t.integer "guest_id", null: false
    t.integer "up"
    t.integer "down"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status", default: 0, null: false
    t.integer "event_id", null: false
    t.index ["event_id"], name: "index_questions_on_event_id"
    t.index ["guest_id"], name: "index_questions_on_guest_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "provider"
    t.string "uid"
    t.string "remember_token"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.integer "guest_id", null: false
    t.integer "question_id", null: false
    t.string "vote_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["guest_id"], name: "index_votes_on_guest_id"
    t.index ["question_id"], name: "index_votes_on_question_id"
  end

  add_foreign_key "events", "users"
  add_foreign_key "guests", "events"
  add_foreign_key "questions", "events"
  add_foreign_key "questions", "guests"
  add_foreign_key "votes", "guests"
  add_foreign_key "votes", "questions"
end
