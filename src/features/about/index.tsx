import { ModuleWrapper } from "@components/module-wrapper";
import { useRequestContext } from "@providers/request-provider";
import { Alert, Badge } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import semver from "semver";
import { Download, Heart, Coffee, Laptop, Github } from "lucide-react";
import { operationHold, generalizeDependencies, GetISOstrDate } from "@utils/general-helper";
import { SkeletonPlaceholder } from "@components/custom-skeleton";
import {
  MainContainer,
  SubContainer,
  TileContainer,
  TerminalContainer,
  CardContainer,
  UserContainer,
} from "@components/container";
import { TabularGridContainer } from "@components/tabular-grid";
import { TitleContainer } from "@components/title";
import { BannerBadge, TechStackType, VersionDetails } from "types";
import {
  TechStack,
  Storage,
  ExternalResources,
  CLI,
  Contributors,
  SystemStatus,
} from "./siteConfigInfo";

export const AboutModule = () => {
  const [dockerRepoData, setDockerRepoData] = useState<any>(null);
  const [latestVersion, setLatestVersion] = useState<VersionDetails | null>(null);
  const [currentVersion, setCurrentVersion] = useState<VersionDetails | null>(null);
  const [versionFetchError, setVersionFetchError] = useState<string[] | null>(null);
  const [prjDependencies, setPrjDependencies] = useState<Record<string, TechStackType>>(
    generalizeDependencies(APP_DEPENDENCIES, TechStack)
  );
  const [systemInfoCards, setSystemInfoCards] = useState<Array<[string, TechStackType]> | null>(
    null
  );
  const [leadCMSbadges, setLeadCMSbadges] = useState<BannerBadge[] | null>(null);
  // really needed (demo included) ?
  const [selfHostedBadge, setSelfHostedBadge] = useState<BannerBadge | null>(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [updateIndicator, setUpdateIndicator] = useState(false);
  const [preLoading, setPreLoading] = useState(true);
  const [versionValidated, setVersionValidated] = useState(false);

  const { client } = useRequestContext();
  const defSkltnTmout = 2000;
  const defSkltnTmoutMultiplier = 5 / 2;

  // banner related badges
  useEffect(() => {
    if (systemInfoCards && versionValidated) {
      const website =
        systemInfoCards?.find(
          (tcstktype: [string, TechStackType]): tcstktype is [string, TechStackType] =>
            tcstktype[0] === "site"
        ) || null;
      const siteVersion = website
        ? website[1].segment_i?.tags?.find((tag) => tag.label === "version")?.value
        : "unknown";

      const badges = [
        {
          label: "Stable",
          variant: "outline",
          attr: "banner-transparent-green",
        },
        {
          label: siteVersion,
          variant: "outline",
          attr: "banner-transparent-blue",
        },
        {
          label: "MIT License",
          variant: "outline",
          attr: "banner-transparent-red",
        },
        {
          label: "Self-Hosted",
          variant: "outline",
          attr: "banner-transparent-orange",
        },
      ].filter((bdg) => bdg.label);

      // setSelfHostedBadge(badges.find((mt) => mt.label === "Self-Hosted") || null)
      setLeadCMSbadges(badges);
      setDataFetched(true);
      setPreLoading(false);
    }
  }, [systemInfoCards, versionValidated]);

  // for system info card trio
  useEffect(() => {
    if (prjDependencies) {
      const systemStack = { ...prjDependencies };

      try {
        if (currentVersion?.version) {
          systemStack.site.segment_i.tags = [
            { label: "version", value: `v${currentVersion?.version}`, attr: "primary" },
          ];
          systemStack.admin.segment_i.tags = [
            { label: "version", value: `v${currentVersion?.version}`, attr: "primary" },
          ];
          systemStack.site.segment_ii.context = [
            (systemStack.site.segment_ii.context ?? [])[0],
            {
              ...(systemStack.site.segment_ii.context ?? [])[1],
              value: GetISOstrDate({
                dateStr: currentVersion?.updatedOn,
              }),
            },
          ];
          systemStack.admin.segment_ii.context = [
            (systemStack.admin.segment_ii.context ?? [])[0],
            {
              ...(systemStack.admin.segment_ii.context ?? [])[1],
              value: GetISOstrDate({
                dateStr: currentVersion?.updatedOn,
              }),
            },
          ];
        }

        if (latestVersion?.version) {
          systemStack.site.segment_i.tags = [
            ...(systemStack.site.segment_i.tags ?? []),
            {
              label: "latest-version",
              value: `v${latestVersion?.version}`,
              attr: "secondary",
              ext: "available",
            },
          ];
          systemStack.admin.segment_i.tags = [
            ...(systemStack.admin.segment_i.tags ?? []),
            {
              label: "latest-version",
              value: `v${latestVersion?.version}`,
              attr: "secondary",
              ext: "available",
            },
          ];
        }
      } catch (err: any) {
        const errors = [...(versionFetchError ?? []), err.message];

        setVersionFetchError(errors);
      }

      setSystemInfoCards(Object.entries(systemStack));
    }
  }, [prjDependencies]);

  useEffect(() => {
    const versionValidator = async () => {
      if (currentVersion?.version && latestVersion?.version) {
        await operationHold(defSkltnTmout / 5);

        const updAvailable = semver.lt(currentVersion.version, latestVersion.version);

        setUpdateIndicator(updAvailable);
        setVersionValidated(true);
      }
    };

    versionValidator();
  }, [currentVersion, latestVersion]);

  useEffect(() => {
    const dockerPRJnamespace = "leadcms";
    const dockerPRJrepo = "core";

    const getSpecificVersionLstUpd = async (version: string) => {
      let result = new Date().toISOString();

      client.api
        .dockerTagDetail(dockerPRJnamespace, dockerPRJrepo, version)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data?.last_updated) {
            result = data.last_updated;
          } else {
            setVersionFetchError(null);
          }
        })
        .catch((err) => {
          const errors = [...(versionFetchError ?? []), err.message];

          setVersionFetchError(errors);
        });

      return result;
    };

    const getDockerHostVersion = async () => {
      client.api
        .dockerTagsDetail(dockerPRJnamespace, dockerPRJrepo)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data) {
            const retrievedVersionList = data
              .map((v: string) => {
                const versionStr = v.replace("-pre", "");

                return {
                  label: v,
                  version: versionStr,
                  extender: parseFloat(versionStr),
                };
              })
              .filter((v: any) => {
                return (
                  (typeof v.extender === "number" && !isNaN(v.extender)) || semver.valid(v.version)
                );
              })
              .sort((fstCmpr: any, nxtCmpr: any) => {
                return semver.rcompare(fstCmpr.version, nxtCmpr.version);
              });

            if (retrievedVersionList && retrievedVersionList?.length > 0) {
              const setLatestTagVersion = async () => {
                const latestTagVersion = retrievedVersionList[0];
                const lastUpdateDateStr = await getSpecificVersionLstUpd(latestTagVersion.label);

                latestTagVersion.updatedOn = lastUpdateDateStr;

                setLatestVersion(latestTagVersion);
              };

              setLatestTagVersion();
              setDockerRepoData(retrievedVersionList);
            }
          } else {
            setVersionFetchError(null);
          }
        })
        .catch((err) => {
          const errors = [...(versionFetchError ?? []), err.message];

          setVersionFetchError(errors);
        });
    };

    const getCurrentVersion = async () => {
      const { data } = await client.api.versionList();

      try {
        if (data) {
          const versionLabel = data.version?.substring(0, data.version.indexOf("-pre") + 4);

          if (versionLabel) {
            const lastUpdateDateStr = await getSpecificVersionLstUpd(versionLabel);

            setCurrentVersion({
              label: versionLabel,
              version: versionLabel.replace("-pre", ""),
              updatedOn: lastUpdateDateStr,
              extender: parseFloat(versionLabel),
            });
          }
        }
      } catch (err: any) {
        setVersionFetchError([err.message]);
      }
    };

    const getLatestVersion = async () => {
      await operationHold(defSkltnTmout);

      await getDockerHostVersion();
    };

    getCurrentVersion();
    getLatestVersion();
  }, []);

  return (
    <ModuleWrapper breadcrumbs={[]} currentBreadcrumb={"About"}>
      <MainContainer
        cmpID="about_section"
        styleObj={{
          cmpTag: "container",
          cmpStyles: ["main-container", "about-section-container"],
        }}
        cmpFontSize={18}
      >
        <SubContainer
          cmpID="banner_area"
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "banner-container",
              updateIndicator ? "" : "no-update-indicator",
            ],
          }}
          cmpFontSize={16}
        >
          <TileContainer
            styleObj={{
              cmpTag: "container",
              cmpStyles: ["logo-container"],
            }}
            cmpFontSize={16}
          >
            <img src="/images/logo.png" alt="LeadCMS.ai Logo" className="brand-logo" />
            <p className="brand-name">LeadCMS.ai</p>
            <p className="brand-moto">The Open-Source Sales Automation & CMS for SaaS</p>
          </TileContainer>
          <TileContainer
            styleObj={{
              cmpTag: "container",
              cmpStyles: ["badge-container"],
            }}
            cmpFontSize={10}
          >
            {leadCMSbadges
              ?.filter((mt) => mt.label !== "Self-Hosted")
              .map((mt, _key) => (
                <span key={`0${_key}`} className={`badge ${mt?.attr}`}>
                  {mt.label}
                </span>
              ))}
          </TileContainer>
        </SubContainer>

        {updateIndicator && (
          <SubContainer
            cmpID="update_indicator"
            styleObj={{
              cmpTag: "container",
              cmpStyles: ["sub-container", "alert-container"],
            }}
            cmpFontSize={16}
          >
            <Alert className="alert-panel normal">
              <h5 className="alert-title">
                <Download />
                <span>New version available: v</span>
                <strong>{latestVersion?.version}</strong>
              </h5>
              <p className="alert-context">
                Update your on-premises deployment using Docker Compose:
              </p>
              <TerminalContainer
                styleObj={{
                  cmpTag: "container",
                  cmpStyles: ["terminal-container"],
                }}
                cliObj={CLI}
              />
            </Alert>
          </SubContainer>
        )}

        <SubContainer
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "system-details-container",
              updateIndicator ? "" : "no-update-indicator",
            ],
          }}
        >
          <>
            {systemInfoCards?.map(([segmentKey, segment]: [string, TechStackType]) => (
              <CardContainer
                key={segmentKey}
                styleObj={{
                  cmpTag: `card card-${segmentKey}`,
                  cmpStyles: ["system-details-card"],
                }}
                skeletonTimeOut={dataFetched ? 0 : defSkltnTmout * defSkltnTmoutMultiplier}
                cHeader={segment?.segment_i || null}
                cBody={segment?.segment_ii || null}
                cFooter={segment?.segment_iii || null}
              />
            ))}
          </>
        </SubContainer>

        <TabularGridContainer
          styleObj={{
            cmpTag: "tabular-segment",
            cmpStyles: ["product-stack-segment"],
          }}
          skeletonTimeOut={dataFetched ? 0 : defSkltnTmout * defSkltnTmoutMultiplier}
          gridObj={SystemStatus}
          tableName={"Product-Stack"}
        />

        <TitleContainer
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["resources-title-bar"],
          }}
          rootElementAlt={"h2"}
          context="Resources"
          expanders={true}
          dividable={true}
        />

        <SubContainer
          cmpID="resources"
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "resources-container",
              ExternalResources.length >= 2 ? "over-two-items" : "",
            ],
          }}
          cmpFontSize={16}
        >
          {ExternalResources.map((link, linkKey) => (
            <TileContainer
              key={linkKey}
              styleObj={{
                cmpTag: "container",
                cmpStyles: ["tile-container", "resource-container", "sklt-resource-container"],
              }}
              cmpFontSize={16}
            >
              <a
                {...(!preLoading && { href: link.url })}
                target="_blank"
                className="resource-link"
                rel="noopener noreferrer"
              >
                {!dataFetched ? (
                  <>
                    <SkeletonPlaceholder
                      styleObj={{
                        cmpTag: "sklt",
                        cmpStyles: ["sklt-icon"],
                      }}
                      variant="circular"
                      width={60}
                      height={60}
                    />
                    <SkeletonPlaceholder
                      styleObj={{
                        cmpTag: "sklt",
                        cmpStyles: ["domain", "sklt-domain"],
                      }}
                      variant="rectangular"
                      width={"45%"}
                      height={16}
                    />
                  </>
                ) : (
                  <>
                    <span className="icon">{link.icon}</span>
                    <h4 className="domain">{link.name}</h4>
                  </>
                )}
              </a>
            </TileContainer>
          ))}
        </SubContainer>

        <TitleContainer
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["contributors-title-bar"],
          }}
          rootElementAlt={"h2"}
          context="Development Team"
          expanders={true}
          dividable={true}
        />

        <SubContainer
          styleObj={{
            cmpTag: "container",
            cmpStyles: [
              "sub-container",
              "contributors-container",
              Contributors.length >= 2 ? "over-two-items" : "",
            ],
          }}
        >
          <>
            {Contributors.map((member, memberKey) => (
              <UserContainer
                key={memberKey}
                styleObj={{
                  cmpTag: "user-card",
                  cmpStyles: ["contributor-user-card"],
                }}
                skeletonTimeOut={dataFetched ? 0 : defSkltnTmout * defSkltnTmoutMultiplier}
                cmpFontSize={14}
                memberObj={member}
              />
            ))}
          </>
        </SubContainer>

        <TitleContainer
          cmpID="footer"
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["footer-title-bar"],
          }}
          context=""
        >
          <div className="footer-panel">
            <p className="from">
              Made with <Heart /> by our LeadCMS-Devs <Laptop />
            </p>
            <div className="sub-actions">
              <button className="sub-act-btn support">
                <Coffee />
                &nbsp;Support the Project
              </button>
              <button className="sub-act-btn review">
                <Github />
                &nbsp;Star us on GitHub
              </button>
            </div>
          </div>
        </TitleContainer>
      </MainContainer>
    </ModuleWrapper>
  );
};
