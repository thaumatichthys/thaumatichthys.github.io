var BOARD_HEIGHT = 400;
var BOARD_WIDTH_TOTAL = 700;
var SHOW_MARKERS = false;
var UP_pressed = false;
var DOWN_pressed = false;
var LEFT_pressed = false;
var W_pressed = false;
var S_pressed = false;
var D_pressed = false;
var SPACE_pressed = false;
var game_paused = false;
var player0_bar_center_y = window.innerHeight / 2;
var player1_bar_center_y = window.innerHeight / 2;
// keeps track of ball velocity vector components in units of pixels/tick
var ball_x_velocity = BALL_VELOCITY * Math.cos(BALL_START_ANGLE);
var ball_y_velocity = BALL_VELOCITY * Math.sin(BALL_START_ANGLE);
var ball_x_val = 50;
var ball_y_val = -100;
var player0_bar = new JSImage(_20x100whiterectangle, 0, player0_bar_center_y - GREEN_BAR_HEIGHT / 2);
var player1_bar = new JSImage(_20x100whiterectangle, BOARD_WIDTH_TOTAL - GREEN_BAR_WIDTH, player1_bar_center_y - GREEN_BAR_HEIGHT / 2);
var ball = new JSImage(_10pxwhitesquare, 50, 100);
var n_banners = 0; // the logical number of banners
var banner_elements = 0; // the actual number of banner objects
var banners = [];
var alert_text = new JSTextBox("text", 0, -100, true);
var pause_text = new JSTextBox("PAUSED", 0, -100, true);
var player0_score = 0;
var player0_score_text = new JSTextBox("0", BOARD_WIDTH_TOTAL * (1 / 3), 20, true);
var player1_score = 0;
var player1_score_text = new JSTextBox("0", BOARD_WIDTH_TOTAL * (2 / 3), 20, true);
var rematch_button = new JSButton("Rematch?", _greysquare, 0, -100, true, ButtonHandler, "rm");
var two_player_button = new JSButton("Two Player", _greysquare, 100, 100, false, ButtonHandler, "tp");
var follower_bot_button = new JSButton("Pong Bot", _greysquare, 100, 200, false, ButtonHandler, "fb");
var predicting_bot_button = new JSButton("Bob the Bot!", _greysquare, 100, 300, false, ButtonHandler, "pb");

function UpdateBannerPositions() {
    // this ended up being way too much effort
    let spacing = BOARD_HEIGHT / (n_banners + 1);
    if (Math.floor(BOARD_HEIGHT / (2 * BANNER_HEIGHT)) > n_banners) {
        let diff = Math.floor(BOARD_HEIGHT / (2 * BANNER_HEIGHT)) - n_banners;
        for (var i = 0; i < diff; i++) {
            banners.push(new JSImage(_10x60whiterectangle, 10, 10 * i));
            banner_elements++;
        }
        n_banners = Math.floor(BOARD_HEIGHT / (2 * BANNER_HEIGHT));
    } else if (Math.floor(BOARD_HEIGHT / (2 * BANNER_HEIGHT)) < n_banners) {
        n_banners = Math.floor(BOARD_HEIGHT / (2 * BANNER_HEIGHT));
    }
    for (var i = 0; i < n_banners; i++) {
        let index = i - (n_banners + 1) / 2 + 1;
        banners[i].Move(BOARD_WIDTH_TOTAL / 2 - BANNER_WIDTH / 2, index * spacing + BOARD_HEIGHT / 2 - BANNER_HEIGHT / 2);
    }
    if (banner_elements > n_banners) {
        for (var i = 0; i < banner_elements - n_banners; i++) {
            let index = i + n_banners;
            banners[index].Move(-100, -100);
        }
    }
}

function UpdatePositions() {
    if (UP_pressed && player1_bar_center_y > GREEN_BAR_HEIGHT / 2) {
        player1_bar_center_y -= PIXELS_PER_MOVEMENT;
    }
    if (DOWN_pressed && player1_bar_center_y < (BOARD_HEIGHT - GREEN_BAR_HEIGHT / 2)) {
        player1_bar_center_y += PIXELS_PER_MOVEMENT;
    }
    if (W_pressed && player0_bar_center_y > GREEN_BAR_HEIGHT / 2) {
        player0_bar_center_y -= PIXELS_PER_MOVEMENT;
    }
    if (S_pressed && player0_bar_center_y < (BOARD_HEIGHT - GREEN_BAR_HEIGHT / 2)) {
        player0_bar_center_y += PIXELS_PER_MOVEMENT;
    }
    player1_bar.Move(BOARD_WIDTH_TOTAL - GREEN_BAR_WIDTH, player1_bar_center_y - GREEN_BAR_HEIGHT / 2);
    player0_bar.Move(0, player0_bar_center_y - GREEN_BAR_HEIGHT / 2);
    ball.Move(Math.round(ball_x_val), Math.round(ball_y_val));
}

function KeyPressHandler(event) {
    const value = true;
    if (event.keyCode == UP_KEY) {
        UP_pressed = value;
        event.preventDefault();
    } else if (event.keyCode == DOWN_KEY) {
        DOWN_pressed = value;
        event.preventDefault();
    } else if (event.keyCode == LEFT_KEY) {
        LEFT_pressed = value;
    } else if (event.keyCode == W_KEY) {
        W_pressed = value;
    } else if (event.keyCode == S_KEY) {
        S_pressed = value;
    } else if (event.keyCode == D_KEY) {
        D_pressed = value;
    } else if (event.keyCode == SPACE_key) {
        SPACE_pressed = value;
    }
    //console.log(event.keyCode);
}

function KeyReleaseHandler(event) {
    const value = false;
    if (event.keyCode == UP_KEY) {
        UP_pressed = value;
        event.preventDefault();
    } else if (event.keyCode == DOWN_KEY) {
        DOWN_pressed = value;
        event.preventDefault();
    } else if (event.keyCode == LEFT_KEY) {
        LEFT_pressed = value;
    } else if (event.keyCode == W_KEY) {
        W_pressed = value;
    } else if (event.keyCode == S_KEY) {
        S_pressed = value;
    } else if (event.keyCode == D_KEY) {
        D_pressed = value;
    } else if (event.keyCode == SPACE_key) {
        SPACE_pressed = value;
    }
}

function BallMovement() {
    ball_x_val += ball_x_velocity;
    ball_y_val += ball_y_velocity;
    if (ball_y_val < 0) {
        ball_y_velocity = Math.abs(ball_y_velocity);
    } else if (ball_y_val > (BOARD_HEIGHT - DOT_WIDTH)) {
        ball_y_velocity = -1 * Math.abs(ball_y_velocity);
    }
    if (ball_x_val <= GREEN_BAR_WIDTH && ball_y_val > player0_bar_center_y - GREEN_BAR_HEIGHT / 2 - DOT_WIDTH && ball_y_val < player0_bar_center_y + GREEN_BAR_HEIGHT / 2) {
        let relative_y = (ball_y_val - player0_bar_center_y) / (GREEN_BAR_HEIGHT / 2);
        let total_velocity;
        if (D_pressed) {
            total_velocity = BALL_VELOCITY * FAST_V_MULTIPLIER;
        } else if (!D_pressed) {
            total_velocity = BALL_VELOCITY;
        }
        //ball_y_velocity = relative_y * Y_VELOCITY * 3;
        //////////////////////////////////////////////////////////////
        ball_y_velocity = Math.sin(relative_y * MAX_ANGLE) * total_velocity;
        ball_x_velocity = Math.abs(Math.cos(relative_y * MAX_ANGLE) * total_velocity);
        //////////////////////////////////////////////////////////////
    }
    if (ball_x_val >= (BOARD_WIDTH_TOTAL - GREEN_BAR_WIDTH - DOT_WIDTH) && ball_y_val > (player1_bar_center_y - GREEN_BAR_HEIGHT / 2 - DOT_WIDTH) && ball_y_val < (player1_bar_center_y + GREEN_BAR_HEIGHT / 2)) {
        let relative_y = (ball_y_val - player1_bar_center_y) / (GREEN_BAR_HEIGHT / 2);
        let total_velocity;
        if (LEFT_pressed) {
            total_velocity = BALL_VELOCITY * FAST_V_MULTIPLIER;
        } else if (!LEFT_pressed) {
            total_velocity = BALL_VELOCITY;
        }
        //ball_y_velocity = relative_y * Y_VELOCITY * 3;
        //////////////////////////////////////////////////////////////
        ball_y_velocity = Math.sin(relative_y * MAX_ANGLE) * total_velocity;
        ball_x_velocity = Math.abs(Math.cos(relative_y * MAX_ANGLE) * total_velocity) * -1;
        //////////////////////////////////////////////////////////////
    }
    ball.Move(Math.round(ball_x_val), Math.round(ball_y_val));
}
document.addEventListener('keydown', KeyPressHandler);
document.addEventListener('keyup', KeyReleaseHandler);
// removes the scroll bars on the sides
document.documentElement.style.overflow = 'hidden';

function BotPlayerZero() {
    let wanted_y = ball_y_val;
    if (player0_bar_center_y > player1_bar_center_y) {
        // try to aim the ball down and away from the other player
        wanted_y -= 40;
        D_pressed = true;
    } else {
        wanted_y += 40;
        D_pressed = true;
    }
    if (ball_x_velocity < 0) {
        if (wanted_y > player0_bar_center_y) {
            S_pressed = true;
            W_pressed = false;
        } else {
            W_pressed = true;
            S_pressed = false;
        }
    } else {
        D_pressed = false;
        W_pressed = false;
        S_pressed = false;
    }
}

function BotPlayerOne() {
    let wanted_y = ball_y_val;
    if (player1_bar_center_y > player0_bar_center_y) {
        // try to aim the ball down and away from the other player
        wanted_y -= 40;
        LEFT_pressed = true;
    } else if (ball_y_val > player1_bar_center_y) {
        wanted_y += 40;
        LEFT_pressed = true;
    }
    if (ball_x_velocity > 0) {
        if (wanted_y > player1_bar_center_y) {
            DOWN_pressed = true;
            UP_pressed = false;
        } else {
            UP_pressed = true;
            DOWN_pressed = false;
        }
    } else {
        LEFT_pressed = false;
        DOWN_pressed = false;
        UP_pressed = false;
    }
}
let counter = 0;
let graph = [];
let graph2 = [];

function TriangleWave(b, m, t, x) {
    // b = phase, m = slope, t = amplitude
    p = 4 * t / m;
    return Math.abs(((4 * t) / p) * Math.abs(((x + 20 * p + (p * b) / (4 * t) - p / 2) % p) - p / 2));
}

function BotPlayerZeroo() {
    let m = ball_y_velocity / ball_x_velocity;
    let t = BOARD_HEIGHT / 2;
    let b = (ball_y_val - m * ball_x_val);
    let ball_landing_y = TriangleWave(b, m, t, GREEN_BAR_WIDTH);
    let target_y = 0;
    if (player1_bar_center_y < BOARD_HEIGHT / 2) target_y = BOARD_HEIGHT;
    let deflection_slope = -1 * ((ball_landing_y - target_y) / (BOARD_WIDTH_TOTAL - 2 * GREEN_BAR_WIDTH));
    let optimal_deflection_angle = Math.atan(deflection_slope);
    let relative_y = (optimal_deflection_angle / MAX_ANGLE) * GREEN_BAR_HEIGHT / 2;
    let wanted_y = ball_landing_y - relative_y;
    if (ball_x_velocity < 0) {
        if (SHOW_MARKERS) {
            if (counter > 20) {
                for (var i = 0; i < BOARD_WIDTH_TOTAL + 100; i += 30) {
                    let y = TriangleWave(b, m, t, i);
                    while (i > (graph.length - 1)) {
                        graph.push(new JSImage(_5pxwhitedot, -10, 10));
                        graph2.push(new JSImage(_5pxbluedot, -10, 10));
                    }
                    graph[i].Move(i, y);
                    graph2[i].Move(i + GREEN_BAR_WIDTH, (deflection_slope * i) + ball_landing_y);
                }
                counter = 0;
            } else {
                counter++;
            }
        }
        D_pressed = true;
        if (wanted_y > player0_bar_center_y && (player0_bar_center_y < (BOARD_HEIGHT - GREEN_BAR_HEIGHT / 2))) {
            player0_bar_center_y++;
            if (wanted_y > (player0_bar_center_y + 10)) player0_bar_center_y += 10;
        } else if (wanted_y < player0_bar_center_y && (player0_bar_center_y > (GREEN_BAR_HEIGHT / 2))) {
            player0_bar_center_y--;
            if (wanted_y < (player0_bar_center_y - 10)) player0_bar_center_y -= 10;
        }
    }
}
let game_state = -1; // STATUS WITHIN GAME 2 = idle, -1 = ongoing, 1, 0 = players won
let match_state = -1; // STATUS WITHIN MATCH -1 = ongoing, 0 = player0 won, etc.
function UpdateScores() {
    if (game_state == 1) {
        // player1 won
        player1_score++;
        player1_score_text.ChangeText(player1_score.toString());
    } else if (game_state == 0) {
        // player0 won
        player0_score++;
        player0_score_text.ChangeText(player0_score.toString());
    }
}

function CheckGameStatus() {
    if (ball_x_val < 0) {
        // player1 wins
        ball_y_val = -100;
        ball.Move(50, -100);
        if (game_state == -1) game_state = 1;
        if (player1_score >= 10) {
            // player1 wins the game
            if (match_state == -1) match_state = 1;
        }
    } else if (ball_x_val > (BOARD_WIDTH_TOTAL - DOT_WIDTH)) {
        // player0 wins
        ball_y_val = -100;
        if (game_state == -1) game_state = 0;
        if (player0_score >= 10) {
            // player0 wins the game
            if (match_state == -1) match_state = 0;
        }
    }
    player0_score_text.Move(BOARD_WIDTH_TOTAL * (1 / 3), 20);
    player1_score_text.Move(BOARD_WIDTH_TOTAL * (2 / 3), 20);
}
let game_mode = 0; // 0 = two player, 1 = pong bot, 2 = predicting bot
function ClearButtons() {
    rematch_button.Move(0, -100);
    two_player_button.Move(0, -100);
    follower_bot_button.Move(0, -100);
    predicting_bot_button.Move(0, -100);
}

function StartGame() {
    player0_score = 0;
    player1_score = 0;
    player0_score_text.ChangeText("0");
    player1_score_text.ChangeText("0");
    player0_bar_center_y = BOARD_HEIGHT / 2;
    player1_bar_center_y = BOARD_HEIGHT / 2;
    alert_text.Move(0, -100);
    UpdatePositions();
    CheckGameStatus();
    UpdateBannerPositions();
    ClearButtons();
    //game_state = -1;
}

function ClearBanners() {
    let x = BOARD_WIDTH_TOTAL * 2;
    for (var i = 0; i < n_banners; i++) {
        banners[i].Move(x, 0);
    }
}

function ButtonHandler(param) {
    if (param == "rm") {
        //rematch clicked
        console.log("rematch clicked");
        match_state = -1;
        if (game_state != -1) game_state = -1;
        StartGame();
    } else if (param == "tp") {
        game_mode = 0;
        match_state = -1;
        StartGame();
    } else if (param == "fb") {
        game_mode = 1;
        match_state = -1;
        StartGame();
    } else if (param == "pb") {
        game_mode = 2;
        match_state = -1;
        StartGame();
    }
}

function ClearScreen() {
    let x = BOARD_WIDTH_TOTAL * 2;
    ball.Move(x, 0);
    player0_bar.Move(x, 0);
    player1_bar.Move(x, 0);
    player0_score_text.Move(x, 0);
    player1_score_text.Move(x, 0);
    rematch_button.Move(x, 0);
    ClearBanners();
}
let previous_space_state = false;

function UpdateTogglePause() {
    if (SPACE_pressed != previous_space_state) {
        previous_space_state = SPACE_pressed;
        if (SPACE_pressed && match_state == -1) {
            game_paused = !game_paused;
            if (game_paused) pause_text.Move(BOARD_WIDTH_TOTAL - 200, 100);
            else pause_text.Move(0, -100);
        }
    }
}
const INTERMATCH_COUNT = 100;
let count = INTERMATCH_COUNT;

function game_loop() {
    UpdateTogglePause();
    BOARD_HEIGHT = window.innerHeight;
    BOARD_WIDTH_TOTAL = window.innerWidth;
    UpdateBannerPositions();
    CheckGameStatus();
    if (!game_paused) {
        if (game_state == -1 && match_state == -1) {
            alert_text.Move(0, -100);
            if (game_mode == 2) BotPlayerZeroo();
            else if (game_mode == 1) BotPlayerZero();
            UpdatePositions();
            BallMovement();
        } else if (game_state != -1 && match_state == -1) {
            count--;
            if (count == INTERMATCH_COUNT - 1) {
                UpdateScores();
            } else if (count == 0) {
                if (game_state == 1) {
                    ball_x_val = 2 * BOARD_WIDTH_TOTAL / 3;
                    ball_y_val = BOARD_HEIGHT / 3;
                    ball_x_velocity = -1 * Math.abs(BALL_VELOCITY * Math.cos(BALL_START_ANGLE));
                    ball_y_velocity = BALL_VELOCITY * Math.sin(BALL_START_ANGLE);
                } else if (game_state == 0 || game_state == 2) {
                    ball_x_val = BOARD_WIDTH_TOTAL / 3;
                    ball_y_val = BOARD_HEIGHT / 3;
                    ball_x_velocity = Math.abs(BALL_VELOCITY * Math.cos(BALL_START_ANGLE));
                    ball_y_velocity = BALL_VELOCITY * Math.sin(BALL_START_ANGLE);
                }
                count = INTERMATCH_COUNT;
                game_state = -1;
            }
            UpdatePositions();
        } else if (match_state != -1) {
            if (match_state == 0) {
                //ClearScreen();
                ClearBanners();
                alert_text.Move(BOARD_WIDTH_TOTAL / 2, BOARD_HEIGHT / 3);
                if (game_mode == 0) alert_text.ChangeText("Player 0 wins!");
                else if (game_mode == 1) alert_text.ChangeText("Pong bot wins!");
                else if (game_mode == 2) alert_text.ChangeText("Bob wins!");
                rematch_button.Move(BOARD_WIDTH_TOTAL / 2, BOARD_HEIGHT / 2);
            }
            if (match_state == 1) {
                ClearBanners();
                alert_text.Move(BOARD_WIDTH_TOTAL / 2, BOARD_HEIGHT / 3);
                alert_text.ChangeText("Player 1 wins!");
                rematch_button.Move(BOARD_WIDTH_TOTAL / 2, BOARD_HEIGHT / 2);
            }
        }
    }
    setTimeout(game_loop, 1000 / GAME_SPEED_HZ);
}
game_state = 2;
match_state = 2;
BOARD_HEIGHT = window.innerHeight;
BOARD_WIDTH_TOTAL = window.innerWidth;
UpdatePositions();
CheckGameStatus();
UpdateBannerPositions();
game_loop();
player0_score = 0;
player1_score = 0;
player0_score_text.ChangeText("0");
player1_score_text.ChangeText("0");