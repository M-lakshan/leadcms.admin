import { useState, useEffect } from "react";
import { LocalContainerProps } from "types";
import { SetComponentStyles } from "@utils/general-helper";
import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import { Globe, Server, Database, Clock } from "lucide-react";
import { SkeletonPlaceholder } from "@components/custom-skeleton";
import { TerminalContainer } from "@components/container";
import { ProgressBar } from "@components/progress-bar";
import { operationHold } from "@utils/general-helper";

export { TabularGridContainer } from "./index.styled";

const iconMap = {
  Server: Server,
  Database: Database,
  Globe: Globe,
  Clock: Clock,
};

export const TabularGrid = ({
  cmpID,
  styleObj,
  gridObj,
  className,
  tableName,
  skeletonTimeOut,
}: LocalContainerProps & {
  gridObj: any;
  tableName?: string;
}) => {
  const [preLoading, setPreLoading] = useState(skeletonTimeOut && skeletonTimeOut > 0);
  const cmpStyles = SetComponentStyles({ className, styleObj });
  const [activeTab, setActiveTab] = useState({
    idx: 0,
    label: Object.keys(gridObj)[0],
  });

  const getTableTabClassList = ({ keyIdx, tabLabel }: { keyIdx: number; tabLabel: string }) => {
    return [
      keyIdx == Object.keys(gridObj).length - 1 ? "last" : "",
      keyIdx != Object.keys(gridObj).length - 1 &&
      keyIdx != activeTab.idx &&
      keyIdx == activeTab.idx - 1
        ? "pre-neighbour"
        : "",
      tabLabel == activeTab.label ? "active" : "",
      keyIdx != 0 && keyIdx != activeTab.idx && keyIdx == activeTab.idx + 1
        ? "post-neighbour psd-after-effects"
        : "",
    ].join(" ");
  };

  const handleTriggerHoverIn = (hoveredEl: HTMLElement) => {
    const triggers = document.querySelectorAll(".controller-btn-tab");

    triggers.forEach((el) => {
      if (
        el !== hoveredEl &&
        !hoveredEl.classList.contains("active") &&
        Array.from(hoveredEl.classList).some((cls) =>
          ["pre-neighbour", "post-neighbour"].includes(cls)
        )
      ) {
        triggers.forEach((elAlt) => {
          const classes = elAlt.className
            .split(" ")
            .map((clsAlt) => (clsAlt === "psd-after-effects" ? "psd-after" : clsAlt));

          elAlt.className = classes.join(" ");
        });
      }
    });
  };

  const handleTriggerHoverOut = () => {
    const triggers = document.querySelectorAll(".controller-btn-tab");

    triggers.forEach((el) => {
      const classes = el.className
        .split(" ")
        .map((cls) => (cls === "psd-after" ? "psd-after-effects" : cls));

      el.className = classes.join(" ");
    });
  };

  useEffect(() => {
    const renderAnimation = async () => {
      if (preLoading && skeletonTimeOut) {
        await operationHold(skeletonTimeOut);
      }

      setPreLoading(false);
    };

    renderAnimation();
  }, []);

  return (
    <div {...(cmpID && { id: cmpID })} {...(cmpStyles && { className: cmpStyles })}>
      <Root
        defaultValue={activeTab.label}
        onValueChange={(e) =>
          setActiveTab({
            idx: Object.keys(gridObj).indexOf(e),
            label: e,
          })
        }
        className={`tab-grid${tableName ? "" : " no-table-name"}`}
      >
        {tableName && <h2 className="table-name">{tableName}</h2>}
        <List className="tab-controller">
          <div className="tab-controller-btns">
            {Object.keys(gridObj).map((tabValue, tabKey) => (
              <Trigger
                key={tabKey}
                value={tabValue}
                className={`tab controller-btn-tab ${getTableTabClassList({
                  keyIdx: tabKey,
                  tabLabel: tabValue,
                })}`}
                onMouseEnter={(e) => handleTriggerHoverIn(e.currentTarget)}
                onMouseLeave={handleTriggerHoverOut}
              >
                {preLoading ? (
                  <SkeletonPlaceholder
                    styleObj={{
                      cmpTag: "sklt",
                      cmpStyles: ["sklt-tag"],
                    }}
                    variant="rectangular"
                    width={"60%"}
                    height={16}
                  />
                ) : (
                  gridObj[tabValue]["identifier"]
                )}
              </Trigger>
            ))}
          </div>
        </List>

        {activeTab.label === "status" && (
          <Content value="status" className="tab-content status-tab-expand">
            {preLoading ? (
              <>
                <SkeletonPlaceholder
                  styleObj={{
                    cmpTag: "sklt",
                    cmpStyles: ["tab-title", "sklt-tab-title"],
                  }}
                  variant="rectangular"
                  width={"35%"}
                  height={28}
                />
                <SkeletonPlaceholder
                  styleObj={{
                    cmpTag: "sklt",
                    cmpStyles: ["tab-descrp", "sklt-tab-descrp"],
                  }}
                  variant="rectangular"
                  width={"70%"}
                  height={16}
                />
                <SkeletonPlaceholder
                  styleObj={{
                    cmpTag: "sklt",
                    cmpStyles: ["progress-tile-container", "sklt-progress-tile-container"],
                  }}
                  variant="rectangular"
                  width={"100%"}
                  height={"40px"}
                />
                <div className="detail-container">
                  {gridObj.status.services.map((service: any) => {
                    return (
                      <div key={service.name} className={"service"}>
                        <SkeletonPlaceholder
                          styleObj={{
                            cmpTag: "sklt",
                            cmpStyles: ["service-icon", "sklt-service-icon"],
                          }}
                          variant="circular"
                          width={35}
                          height={35}
                        />
                        <div className="details">
                          <SkeletonPlaceholder
                            styleObj={{
                              cmpTag: "name",
                              cmpStyles: ["name", "sklt-name"],
                            }}
                            variant="rectangular"
                            width={"35%"}
                            height={14}
                          />
                          <SkeletonPlaceholder
                            styleObj={{
                              cmpTag: "sklt",
                              cmpStyles: ["descrp", "sklt-descrp"],
                            }}
                            variant="rectangular"
                            width={"70%"}
                            height={12}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h2 className="tab-title">{gridObj.status.type}</h2>
                <p className="tab-descrp">{gridObj.status.descrp}</p>
                <ProgressBar
                  rate={gridObj.status.healthProgress}
                  label="Overall Health"
                  value={true}
                  negation={true}
                />
                <div className="detail-container">
                  {gridObj.status.services.map((service: any) => {
                    const Icon = iconMap[service.icon as keyof typeof iconMap];
                    const healthState = gridObj.status.healthProgress;
                    let param = 0;

                    if (healthState >= 85) {
                      param = 85;
                    } else if (healthState >= 65) {
                      param = 65;
                    } else if (healthState >= 35) {
                      param = 35;
                    } else if (healthState >= 10) {
                      param = 10;
                    }

                    return (
                      <div key={service.name} className={"service"}>
                        {Icon && (
                          <span className={`service-icon srvc-${param}-progress `}>
                            <Icon className={`${service.bgColor}`} />
                          </span>
                        )}
                        <div className="details">
                          <p className="name">{service.name}</p>
                          <p className="descrp">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Content>
        )}

        {!preLoading && activeTab.label === "database" && (
          <Content value="database" className="tab-content database-tab-expand">
            <>
              <h2 className="tab-title">{gridObj.database.identifier}</h2>
              <p className="tab-descrp">{gridObj.database.descrp}</p>
              <div className="list">
                {Object.entries(gridObj.database).map(([infoKey, value]) => {
                  if (["identifier", "descrp"].includes(infoKey)) return null;

                  return (
                    <p key={infoKey} className={"database-meta-info"}>
                      <span>{infoKey}</span>
                      <strong>{String(value)}</strong>
                    </p>
                  );
                })}
              </div>
            </>
          </Content>
        )}

        {!preLoading && activeTab.label === "deployement" && (
          <Content value="deployement" className="tab-content deployement-tab-expand">
            <h2 className="tab-title">{gridObj.deployement.type}</h2>
            <p className="tab-descrp">{gridObj.deployement.descrp}</p>
            <div className="list">
              {Object.entries(gridObj.deployement).map(([infoKey, value]) => {
                if (
                  ["dockerHelp", "showDockerHelp", "identifier", "descrp", "type"].includes(infoKey)
                )
                  return null;

                return (
                  <p key={infoKey} className={"deployement-meta-info"}>
                    <span>{infoKey}</span>
                    <strong>{String(value)}</strong>
                  </p>
                );
              })}
            </div>

            {gridObj.deployement.showDockerHelp && (
              <div className="sub-tab-content development-terminal-container">
                <span className="sub-title">{gridObj.deployement.dockerHelp.helpText}</span>
                <TerminalContainer
                  styleObj={{
                    cmpTag: "container",
                    cmpStyles: ["terminal-container", "development-terminal"],
                  }}
                  cliObj={{
                    dir: gridObj.deployement.dockerHelp.dir,
                    cmd: gridObj.deployement.dockerHelp.cmd,
                  }}
                />
              </div>
            )}
          </Content>
        )}

        {preLoading && (activeTab.label === "database" || activeTab.label === "deployement") && (
          <Content value={activeTab.label} className={`tab-content ${activeTab.label}-tab-expand`}>
            <SkeletonPlaceholder
              styleObj={{
                cmpTag: "sklt",
                cmpStyles: ["tab-title", "sklt-tab-title"],
              }}
              variant="rectangular"
              width={"35%"}
              height={28}
            />
            <SkeletonPlaceholder
              styleObj={{
                cmpTag: "sklt",
                cmpStyles: ["tab-descrp", "sklt-tab-descrp"],
              }}
              variant="rectangular"
              width={"70%"}
              height={16}
            />
            <div className="list">
              {Object.entries(gridObj.database).map(([infoKey, value]) => {
                if (["identifier", "descrp"].includes(infoKey)) return null;

                return (
                  <p key={infoKey} className={"database-meta-info"}>
                    <span>
                      <SkeletonPlaceholder
                        styleObj={{
                          cmpTag: "sklt",
                          cmpStyles: ["list-item-label", "sklt-list-item-label"],
                        }}
                        variant="rectangular"
                        width={120}
                        height={16}
                      />
                    </span>
                    <strong>
                      <SkeletonPlaceholder
                        styleObj={{
                          cmpTag: "sklt",
                          cmpStyles: ["list-item-value", "sklt-list-item-value"],
                        }}
                        variant="rectangular"
                        width={200}
                        height={14}
                      />
                    </strong>
                  </p>
                );
              })}
            </div>
            {activeTab.label === "deployement" && gridObj?.deployement?.showDockerHelp && (
              <SkeletonPlaceholder
                styleObj={{
                  cmpTag: "sklt",
                  cmpStyles: [
                    "sub-tab-content",
                    "development-terminal-container",
                    "sklt-development-terminal-container",
                  ],
                }}
                variant="rectangular"
                width={"100%"}
                height={250}
              />
            )}
          </Content>
        )}
      </Root>
    </div>
  );
};
