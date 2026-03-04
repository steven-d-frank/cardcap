package handler

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v4"

	"github.com/steven-d-frank/cardcap/backend/internal/apperror"
	"github.com/steven-d-frank/cardcap/backend/internal/logger"
	"github.com/steven-d-frank/cardcap/backend/internal/validate"
)

type WaitlistHandler struct {
	pool *pgxpool.Pool
}

func NewWaitlistHandler(pool *pgxpool.Pool) *WaitlistHandler {
	return &WaitlistHandler{pool: pool}
}

type waitlistRequest struct {
	Email string `json:"email"`
}

func (h *WaitlistHandler) Subscribe(c echo.Context) error {
	var req waitlistRequest
	if err := c.Bind(&req); err != nil {
		return apperror.BadRequest("Invalid request body")
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if err := validate.Email(req.Email); err != nil {
		return apperror.BadRequest("Invalid email address")
	}

	_, err := h.pool.Exec(
		c.Request().Context(),
		"INSERT INTO waitlist_emails (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
		req.Email,
	)
	if err != nil {
		logger.Error("waitlist insert failed", "error", err.Error())
		return apperror.Internal(fmt.Errorf("failed to save email: %w", err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{"ok": true})
}

func (h *WaitlistHandler) Count(c echo.Context) error {
	var count int
	err := h.pool.QueryRow(context.Background(), "SELECT COUNT(*) FROM waitlist_emails").Scan(&count)
	if err != nil {
		logger.Error("waitlist count failed", "error", err.Error())
		return apperror.Internal(fmt.Errorf("failed to count emails: %w", err))
	}
	return c.JSON(http.StatusOK, map[string]interface{}{"count": count})
}
