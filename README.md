# activitygal

This is a student project for ada developers academy, c18 digital. We did not complete the activitypub implementation by code freeze at the end of Monday, 13 Feb 2023.

## goals

Develop a photography portfolio website software in node/express that implements a basic ActivityPub actor, allowing direct sharing of photos and galleries on the fediverse.

## stack

xpressjs on babel-node, sequelize for database, pug templateing, with htmx for interactivity and server-side rendered fragments. minimal js only on admin ui

partial implementation of activitypub with multiple actors managed by a single admin account

## achievements

Basic photo management UI, allowing photo upload to galleries, gallery association to pages, some text fields for titling/captioning on each.

Incomplete activitypub implementation; interaction does not work. Wbbfinger, json-LD output for pages as "User" actors, galleries as "Note" activities, and individual photos as note attachments. Local inbox to accept follow activities, outbox to publish activities for remote fetch, and signing and delivery of activities to inboxes of remote followers. A lot of this work is in branch [activitypub-models](../../tree/activitypub-models)

## conclusions

Turns out learning a new tech stack from scratch by ourselves was difficult; we could have made faster progress by going with Flask, sqlalchemy, and other things we learned in class.

API and frontend probably should have been separate. At first we started work on a single repository, and by the time this felt like a problem, we were too close to deadline to worry about changing things.

Activitypub work should have started much earlier. This was delayed by the process of learning a new stack.

Pair programming more might have helped us stay on the same page and sync up our learning, but it felt more important to distribute effort.

Initial planning sessions were probably too abstract and forward-thinking. Early planning might have been more useful if we had more experience with this stack, or with activitypub.
