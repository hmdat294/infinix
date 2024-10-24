<?php

use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


// Broadcast::channel('connection.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id
//     || $user->friendsOf->concat($user->friendsOfMine)->contains('id', $id)
//     || $user->followers->contains('id', $id);
// });
