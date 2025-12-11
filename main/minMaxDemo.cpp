#include <iostream>
#include <vector>
#include <limits>

using namespace std;

const char HUMAN = 'X';
const char AI = 'O';
const char EMPTY = ' ';

// Print board
void printBoard(const vector<char>& board) {
    cout << "\n";
    for (int i = 0; i < 9; i++) {
        cout << " " << board[i];
        if (i % 3 != 2) cout << " |";
        else if (i != 8) cout << "\n-----------\n";
    }
    cout << "\n\n";
}

// Check winner
char checkWinner(const vector<char>& b) {
    int wins[8][3] = {
        {0,1,2},{3,4,5},{6,7,8}, // rows
        {0,3,6},{1,4,7},{2,5,8}, // cols
        {0,4,8},{2,4,6}          // diags
    };

    for (auto &w : wins) {
        if (b[w[0]] != EMPTY &&
            b[w[0]] == b[w[1]] &&
            b[w[1]] == b[w[2]]) {
            return b[w[0]];
        }
    }
    return EMPTY;
}

bool isFull(const vector<char>& board) {
    for (char c : board)
        if (c == EMPTY) return false;
    return true;
}

// PERFECT minimax with depth
int minimax(vector<char>& board, bool isMaximizing, int depth) {
    char winner = checkWinner(board);
    if (winner == AI)    return 10 - depth;
    if (winner == HUMAN) return depth - 10;
    if (isFull(board))   return 0;

    if (isMaximizing) {
        int bestScore = -10000;
        for (int i = 0; i < 9; i++) {
            if (board[i] == EMPTY) {
                board[i] = AI;
                bestScore = max(bestScore, minimax(board, false, depth + 1));
                board[i] = EMPTY;
            }
        }
        return bestScore;
    } else {
        int bestScore = 10000;
        for (int i = 0; i < 9; i++) {
            if (board[i] == EMPTY) {
                board[i] = HUMAN;
                bestScore = min(bestScore, minimax(board, true, depth + 1));
                board[i] = EMPTY;
            }
        }
        return bestScore;
    }
}

// Find best AI move
int bestMove(vector<char>& board) {
    int bestScore = -10000;
    int move = -1;

    for (int i = 0; i < 9; i++) {
        if (board[i] == EMPTY) {
            board[i] = AI;
            int score = minimax(board, false, 0);
            board[i] = EMPTY;

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

int main() {
    vector<char> board(9, EMPTY);
    cout << "Welcome to Tic Tac Toe!\n";
    cout << "You are X, AI is O.\n";

    // Choose who goes first
    char first;
    cout << "Who should go first? (H for Human, A for AI): ";
    cin >> first;
    first = toupper(first);

    bool humanTurn = (first == 'H');
    printBoard(board);

    while (true) {
        if (humanTurn) {
            int pos;
            cout << "Enter your move (1-9): ";
            cin >> pos;
            pos--;

            if (pos < 0 || pos > 8 || board[pos] != EMPTY) {
                cout << "Invalid move. Try again.\n";
                continue;
            }

            board[pos] = HUMAN;
            printBoard(board);

            if (checkWinner(board) == HUMAN) {
                cout << "You win!\n";
                break;
            }
            if (isFull(board)) {
                cout << "Draw!\n";
                break;
            }
        } else {
            int aiMove = bestMove(board);
            board[aiMove] = AI;
            cout << "AI chooses position " << (aiMove + 1) << "\n";
            printBoard(board);

            if (checkWinner(board) == AI) {
                cout << "AI wins!\n";
                break;
            }
            if (isFull(board)) {
                cout << "Draw!\n";
                break;
            }
        }

        humanTurn = !humanTurn; // swap turns
    }

    return 0;
}
