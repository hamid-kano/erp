<?php

it('redirects unauthenticated users from home page', function () {
    $this->get('/')->assertStatus(302);
});
