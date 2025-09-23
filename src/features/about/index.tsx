import { ModuleWrapper } from "@components/module-wrapper";
import { useRequestContext } from "@providers/request-provider";
import { Alert, Badge } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { Download, Heart, Coffee, Laptop, Github } from "lucide-react";
import {
  MainContainer,
  SubContainer,
  TileContainer,
  GridContainer,
  TerminalContainer,
  CardContainer,
  UserContainer,
} from "@components/container";
import { TabularGridContainer } from "@components/tabular-grid";
import { TitleContainer } from "@components/title";
import {
  LeadCMSbadges,
  TechStack,
  Storage,
  ExternalResources,
  CLI,
  Contributors,
  SystemStatus,
} from "./siteConfigInfo";

export const AboutModule = () => {
  const [gitRepoData, setGitRepoData] = useState(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [versionFetchError, setVersionFetchError] = useState<string | null>(null);
  const [systemInfoCards, setSystemInfoCards] = useState(Object.entries(TechStack));
  const [updateIndicator, setUpdateIndicator] = useState(false);

  const selfHostedBadge = LeadCMSbadges.find((mt) => mt.label === "Self-Hosted") || null;
  const versionValidated = useRef(false);

  const { client } = useRequestContext();

  const operationHold = (ms: number) =>
    new Promise<void>((resolve) => window.setTimeout(() => resolve(), ms));

  ///////////////// temp hook ///////////////////////
  useEffect(() => {
    const versionValidator = async () => {
      if (currentVersion && gitRepoData && !versionValidated.current) {
        // Storage.server.deployment === "On-Premises"
        await operationHold(2000);

        const curVsn = parseFloat(currentVersion);
        const lstVsn = parseFloat(gitRepoData["id"]);
        versionValidated.current = true;

        console.log(curVsn, lstVsn);
        setUpdateIndicator(curVsn < lstVsn);
      }
    };

    versionValidator();
  }, [currentVersion, gitRepoData]);
  //////////////////////////////////////////////////////

  useEffect(() => {
    const versionValidator = async () => {
      if (currentVersion && latestVersion && !versionValidated.current) {
        // Storage.server.deployment === "On-Premises"operationHold
        await operationHold(2000);

        const curVsn = parseFloat(currentVersion);
        const lstVsn = parseFloat(latestVersion);
        versionValidated.current = true;

        setUpdateIndicator(curVsn < lstVsn);
      }
    };

    versionValidator();
  }, [currentVersion, latestVersion]);

  useEffect(() => {
    const getCurrentVersion = async () => {
      const { data } = await client.api.versionList();

      setCurrentVersion(data.version || "Unknown");
    };

    const getLatestVersion = async () => {
      // fetch(`https://api.github.com/repos/LeadCMS/leadcms.admin/releases`)
      fetch("https://api.github.com/repos/LeadCMS/leadcms.admin")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data) {
            // const repoObj = JSON.parse(data);
            // setGitRepoData(repoObj);

            setGitRepoData(data);
            // setLatestVersion(data.latestRelease);
          } else {
            setVersionFetchError(null);
          }
        })
        .catch((err) => setVersionFetchError(err.message));
    };

    getCurrentVersion();
    getLatestVersion();
  });

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
        <p>
          Backend: {currentVersion} | Backend: {latestVersion}
        </p>
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
            {LeadCMSbadges.filter((mt) => mt.label !== "Self-Hosted").map((mt, _key) => (
              <Badge key={`0${_key}`} className={`badge ${mt.attr}`}>
                {mt.label}
              </Badge>
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
                <>
                  <Download />
                  &nbsp;
                </>
                <span>New version available:&nbsp;v{latestVersion}</span>
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
            {systemInfoCards.map(([segmentKey, segment]) => (
              <CardContainer
                key={segmentKey}
                styleObj={{
                  cmpTag: `card card-${segmentKey}`,
                  cmpStyles: ["system-details-card"],
                }}
                cHeader={segment.segment_i || null}
                cBody={segment.segment_ii || null}
                cFooter={segment.segment_iii || null}
              />
            ))}
          </>
        </SubContainer>

        <TabularGridContainer
          styleObj={{
            cmpTag: "tabular-segment",
            cmpStyles: ["product-stack-segment"],
          }}
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
          divisable={true}
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
          <>
            {ExternalResources.map((link, linkKey) => (
              <TileContainer
                key={linkKey}
                styleObj={{
                  cmpTag: "container",
                  cmpStyles: ["tile-container", "resource-container"],
                }}
                cmpFontSize={16}
              >
                <a
                  href={link.url}
                  target="_blank"
                  className="resource-link"
                  rel="noopener noreferrer"
                >
                  <span className="icon">{link.icon}</span>
                  <h4 className="domain">{link.name}</h4>
                </a>
              </TileContainer>
            ))}
          </>
        </SubContainer>

        <TitleContainer
          styleObj={{
            cmpTag: "title-bar",
            cmpStyles: ["contributors-title-bar"],
          }}
          rootElementAlt={"h2"}
          context="Development Team"
          expanders={true}
          divisable={true}
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
          rootElementAlt={"p"}
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
