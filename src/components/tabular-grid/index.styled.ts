import { styled } from "@mui/material";
import { StyledProps } from "types";
import { TabularGrid } from "./index";
import * as GSB from "@utils/general-style-builder";

const serviceTagSingleEdgeCornerRadius = "8px";

const TabularGridContainer = styled(TabularGrid)<StyledProps>`
  &.tabular-segment {
    ${GSB.OverwriteDefaults(false)}
    font-family: ${({ theme }) => theme.typography.fontFamily};
  }

  &.product-stack-segment {
    ${GSB.DPflex("row", "center", "center", "max-content", "100%")}
    grid-column: 1/3;
    overflow: hidden;
    align-self: center;

    .tab-grid {
      ${GSB.DPgrid(["max-content", "auto"], ["auto"], "100%")}
      margin: 25px 0px 30px;
      width: 100%;
      border-radius: 26px;

      .table-name {
        display: none;
      }

      .tab-controller {
        ${GSB.DPflex("row", "center", "space-between", "48px", "100%")}
        grid-area: 1/1/2/5;
        justify-self: center;
        margin-bottom: 20px;
        background: ${({ theme }) => theme.palette.customSegments.TabularGridContainer.default};
        border-radius: 8px;
        padding: 5px 7px;

        .tab-controller-btns {
          ${GSB.DPflex("row", "center", "space-between", "100%", "100%")}

          .tab {
            ${GSB.DPflex("row", "center", "center", "100%", "100%")}
            font-size: 14px;
            font-family: inherit !important;
            padding: 5px 35px 5px 20px;
            text-align: center;
            min-width: max-content;
            border: none;
            ${GSB.HoverOver("pointer", "350ms", "ease-out", "ease-in")}
            position: relative;
            z-index: 2;

            &:hover {
              background: ${({ theme }) =>
                theme.palette.customSegments.TabularGridContainer.primaryHover};
              border-radius: 5px;
              font-weight: 500;
            }

            &:first-of-type {
              border-top-left-radius: 5px;
              border-bottom-left-radius: 5px;
            }

            &:last-child {
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
            }

            .sklt-tag {
              border-radius: 3px;
            }
          }

          .tab.active {
            background: ${({ theme }) => theme.palette.background.default};
            transition: 350ms ease-in-out;
            border-radius: 5px;
            font-weight: 500;
          }
        }
      }

      .tab-content {
        border-radius: 10px;
        grid-area: 2/1/3/5;
        background: ${({ theme }) => theme.palette.background.default};
        ${GSB.BoxShadow(
          "1px",
          "1px",
          "5px",
          "1px",
          (theme) => theme.palette.customSegments.TabularGridContainer.primaryHover
        )}
        padding: 25px 25px 25px 18px;
        justify-self: center;
        width: calc(100% - 7px) !important;

        .tab-title {
          grid-area: 1/1/2/3;
          transform: translate(13px, -7px);
        }

        .tab-descrp {
          grid-area: 2/1/3/3;
          transform: translateY(-5px);
          text-indent: 15px;
        }

        .sklt-tab-title {
          border-radius: 3px;
          margin: 5px 0px 8px;
        }

        .sklt-tab-descrp {
          border-radius: 3px;
          margin-bottom: 3px;
          transform: translateX(12px);
        }

        .sklt-progress-tile-container {
          transform: translateX(12px);
          margin: 5px 0px 20px;
          border-radius: 8px;
          max-width: calc(100% - 12px) !important;
        }
      }

      .status-tab-expand {
        ${GSB.DPgrid(["repeat(2,50%)"], ["repeat(2,auto)"], "")}

        .progress-tile-container {
          grid-area: 3/1/4/3;
        }

        .detail-container {
          ${GSB.DPgrid(["repeat(2,50%)"], ["repeat(2,auto)"], "100%", "100%", "10px")}
          grid-area: 4/1/5/3;
          padding-bottom: 5px;

          .service {
            ${GSB.DPgrid(
              ["50px", "repeat(2,auto)"],
              ["repeat(2,auto)"],
              "100%",
              "calc(100% - 10px)"
            )}
            padding: 15px 15px 12px;
            border-radius: 5px;
            background: ${({ theme }) => theme.palette.info.contrastText};
            ${GSB.BoxShadow(
              "1px",
              "1px",
              "5px",
              "1px",
              (theme) => theme.palette.customSegments.TabularGridContainer.primary
            )}

            &:nth-of-type(odd) {
              justify-self: flex-end;
            }

            &:first-of-type {
              border-top-left-radius: ${serviceTagSingleEdgeCornerRadius};
            }

            &:nth-of-type(2) {
              border-top-right-radius: ${serviceTagSingleEdgeCornerRadius};
            }

            &:nth-last-of-child(2) {
              border-bottom-left-radius: ${serviceTagSingleEdgeCornerRadius};
            }

            &:last-child {
              border-bottom-right-radius: ${serviceTagSingleEdgeCornerRadius};
            }

            .service-icon {
              ${GSB.DPflex("row", "center", "center", "40px", "40px")}
              padding: 7px;
              border-radius: 50%;
              grid-area: 1/1/3/3;
              color: ${({ theme }) =>
                theme.palette.customSegments.TabularGridContainer.captionText};
              align-self: center;

              svg {
                ${GSB.DPblock("inline-block", "max-content", "32px")}
              }
            }

            .srvc-0-progress,
            .srvc-10-progress,
            .srvc-35-progress {
              color: ${({ theme }) => theme.palette.customAlerts.danger.defaultText};
              background: ${({ theme }) => theme.palette.customAlerts.danger.light};
            }

            .srvc-65-progress {
              color: ${({ theme }) => theme.palette.customAlerts.attention.defaultText};
              background: ${({ theme }) => theme.palette.customAlerts.attention.light};
            }

            .srvc-85-progress {
              color: ${({ theme }) => theme.palette.customAlerts.complete.defaultText};
              background: ${({ theme }) => theme.palette.customAlerts.complete.light};
            }

            .details {
              ${GSB.DPflex("column", "flex-start", "flex-start", "100%", "100%")}
              grid-area: 1/2/3/4;

              .name {
                font-size: 14px;
                font-weight: 600;
                padding: 0px 5px 2px;
                color: ${({ theme }) =>
                  theme.palette.customSegments.TabularGridContainer.captionText};
              }

              .descrp {
                font-size: 14px;
                padding: 0px 5px;
                color: ${({ theme }) =>
                  theme.palette.customSegments.TabularGridContainer.foreground};
                text-indent: 3px;
              }

              .sklt-name {
                margin-bottom: 5px;
                border-radius: 3px;
                transform: translateY(3px);
              }

              .sklt-descrp {
                margin-bottom: 15px;
                border-radius: 3px;
                transform: translateY(3px);
              }
            }
          }
        }
      }

      .database-tab-expand,
      .deployement-tab-expand {
        ${GSB.DPgrid(["repeat(2,50%)"], ["repeat(2,auto)"], "")}
        width: 100%;

        .list {
          ${GSB.DPgrid(["repeat(2,50%)"], ["repeat(2,auto)"], "100%", "100%", "10px")}
          grid-area: 4/1/5/3;

          .database-meta-info,
          .deployement-meta-info {
            ${GSB.DPflex("column", "flex-start", "flex-start", "max-content", "max-content")}
            border-radius: 10px;
            overflow: hidden;

            span {
              padding: 6px 16px 3px 15px;
              color: ${({ theme }) => theme.palette.customSegments.TabularGridContainer.secondary};
            }

            strong {
              padding: 3px 16px 12px;
              color: ${({ theme }) =>
                theme.palette.customSegments.TabularGridContainer.contrastText};
              font-weight: 500;
            }

            &:first-of-type,
            &:nth-of-type(2) {
              margin-top: 10px;
            }

            .sklt-list-item-label {
              border-radius: 3px;
            }

            .sklt-list-item-value {
              border-radius: 3px;
            }
          }
        }

        .development-terminal-container {
          ${GSB.DPflex("column-reverse", "center", "center", "max-content", "100%")}
          grid-area: 5/1/6/3;
          padding: 0px 8px 12px;
          margin: 20px 0px 5px;
          border-radius: 8px;
          max-width: calc(100% - 12px) !important;
          background: ${({ theme }) => theme.palette.customSegments.TabularGridContainer.default};
          ${GSB.BoxShadow(
            "1px",
            "1px",
            "3px",
            "1px",
            (theme) => theme.palette.customSegments.CardContainer.primaryHover
          )}
          justify-self: center;
          transform: translateX(1px);

          .sub-title {
            ${GSB.DPblock("inline-block", "max-content", "100%")}
            padding: 8px 15px 4px;
            font-size: 12px;
            color: ${({ theme }) => theme.palette.customSegments.TabularGridContainer.secondary};
          }
        }
      }
    }
  }
`;

export { TabularGridContainer };
