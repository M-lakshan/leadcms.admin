import React, { useEffect, useState } from "react";
import { SkeletonPlaceholder } from "@components/custom-skeleton";
import { Globe, Server, Layers, Terminal } from "lucide-react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { LocalContainerProps, CLIinstance, TechStackSegment } from "types";
import { SetComponentStyles } from "@utils/general-helper";
import { operationHold } from "@utils/general-helper";

export {
  MainContainer,
  SubContainer,
  TileContainer,
  GridContainer,
  TerminalContainer,
  CardContainer,
  UserContainer,
} from "./index.styled";

const iconMap = {
  Terminal: Terminal,
  Server: Server,
  Layers: Layers,
  Globe: Globe,
};

export const Container = ({
  cmpID,
  styleObj,
  children,
  rootElement,
  cmpFontSize,
  className,
  skeletonTimeOut,
}: LocalContainerProps) => {
  const [preLoading, setPreLoading] = useState(skeletonTimeOut && skeletonTimeOut > 0);
  const cmpStyles = SetComponentStyles({ className, styleObj });
  const RootElement: React.ElementType = rootElement || "div";

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
    <RootElement {...(cmpID && { id: cmpID })} {...(cmpStyles && { className: cmpStyles })}>
      {children}
    </RootElement>
  );
};

export const CustomTerminal = ({
  cmpID,
  styleObj,
  cliObj,
  className,
}: LocalContainerProps & { cliObj: CLIinstance }) => {
  const cmpStyles = SetComponentStyles({ className, styleObj });

  return (
    <div {...(cmpID && { id: cmpID })} {...(cmpStyles && { className: cmpStyles })}>
      {Object.entries(cliObj).map(([cliKey, cliContext], i) => {
        if (!Array.isArray(cliContext)) {
          return (
            <p key={`${cliKey}_${i}`} className={`directory ${cliKey.toLowerCase()}_${i + 1}`}>
              <Terminal />
              &nbsp;<span>{cliContext}</span>
            </p>
          );
        } else {
          if (cliContext.every((item) => typeof item === "object" && item !== null)) {
            return (
              <pre key={`${cliKey}_${i}`} className="terminal-box">
                {cliContext.map(({ comment, command }, j) => (
                  <div key={`${cliKey}_${i}_${j}`} className="code-block">
                    <code className="comment">{comment}</code>
                    <br />
                    <code className="command">{command}</code>
                  </div>
                ))}
              </pre>
            );
          }

          return (
            <pre key={cliKey} className="terminal-box">
              {cliContext.map((cmd, cmdkey) => (
                <code key={cmdkey} className={`preset preset_${Number(cliKey) + 1}_${cmdkey + 1}`}>
                  {cmd.toString()}
                </code>
              ))}
            </pre>
          );
        }
      })}
    </div>
  );
};

export const Card = ({
  cmpID,
  styleObj,
  cHeader,
  cBody,
  cFooter,
  className,
  onMouseEnter,
  skeletonTimeOut,
}: LocalContainerProps & {
  cHeader?: TechStackSegment;
  cBody?: TechStackSegment;
  cFooter?: TechStackSegment;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  const [preLoading, setPreLoading] = useState(skeletonTimeOut && skeletonTimeOut > 0);
  const cmpStyles = SetComponentStyles({ className, styleObj });
  const Icon = cHeader ? iconMap[cHeader?.icon as keyof typeof iconMap] : undefined;

  useEffect(() => {
    const renderAnimation = async () => {
      if (preLoading && skeletonTimeOut) {
        await operationHold(skeletonTimeOut);
      }

      setPreLoading(false);
    };

    renderAnimation();
  }, []);

  if (preLoading) {
    return (
      <div
        {...(cmpID && { id: cmpID })}
        {...(cmpStyles && { className: cmpStyles })}
        onMouseEnter={onMouseEnter}
      >
        {cHeader && (
          <div className="card-details card-header">
            {cHeader?.title && (
              <SkeletonPlaceholder
                styleObj={{
                  cmpTag: "sklt",
                  cmpStyles: ["tile", "sklt-title"],
                }}
                variant="rectangular"
                width={"55%"}
                height={28}
              />
            )}
            {cHeader?.descrp && (
              <SkeletonPlaceholder
                styleObj={{
                  cmpTag: "sklt",
                  cmpStyles: ["descrp", "sklt-descrp"],
                }}
                variant="rectangular"
                width={"70%"}
                height={16}
              />
            )}
            {cHeader?.tags && (
              <div className="tags">
                {cHeader.tags.map((tag, tagKey) => (
                  <SkeletonPlaceholder
                    key={tagKey}
                    styleObj={{
                      cmpTag: "sklt",
                      cmpStyles: ["sklt-tag", `tag_${Number(tagKey) + 1} ${tag.label} ${tag.attr}`],
                    }}
                    variant="rectangular"
                    width={100}
                    height={24}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        {cBody && (
          <div className="card-details card-body">
            {cBody?.descrp && (
              <SkeletonPlaceholder
                styleObj={{
                  cmpTag: "sklt",
                  cmpStyles: ["descrp", "sklt-descrp"],
                }}
                variant="rectangular"
                width={"80%"}
                height={16}
              />
            )}
            {cBody?.context && (
              <div className="sums meta-sums">
                {cBody.context.map((lblnv, lblnvKey) => (
                  <p key={lblnvKey} className={`sum sklt-sum sum-${Number(lblnvKey) + 1}`}>
                    <SkeletonPlaceholder
                      styleObj={{
                        cmpTag: "sklt",
                        cmpStyles: ["label", "sklt-label"],
                      }}
                      variant="rectangular"
                      width={135}
                      height={16}
                    />
                    <SkeletonPlaceholder
                      styleObj={{
                        cmpTag: "sklt",
                        cmpStyles: ["value", "sklt-value"],
                      }}
                      variant="rectangular"
                      width={90}
                      height={16}
                    />
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
        {cFooter && (
          <div className="card-details card-footer">
            {cFooter?.descrp && (
              <SkeletonPlaceholder
                styleObj={{
                  cmpTag: "sklt",
                  cmpStyles: ["descrp", "sklt-descrp"],
                }}
                variant="rectangular"
                width={"80%"}
                height={16}
              />
            )}
            {cFooter?.context && (
              <div className="sums dependency-sums">
                {cFooter.context.map((dpncy, dpncyKey) => (
                  <p key={dpncyKey} className={`sum sklt-sum sum-${Number(dpncyKey) + 1}`}>
                    <SkeletonPlaceholder
                      styleObj={{
                        cmpTag: "sklt",
                        cmpStyles: ["label", "sklt-label"],
                      }}
                      variant="rectangular"
                      width={100}
                      height={14}
                    />
                    <SkeletonPlaceholder
                      styleObj={{
                        cmpTag: "sklt",
                        cmpStyles: ["value", "sklt-value"],
                      }}
                      variant="rectangular"
                      width={50}
                      height={14}
                    />
                  </p>
                ))}
              </div>
            )}
            {cFooter?.children && <>{cFooter.children}</>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...(cmpID && { id: cmpID })}
      {...(cmpStyles && { className: cmpStyles })}
      onMouseEnter={onMouseEnter}
    >
      {cHeader && (
        <div className="card-details card-header">
          {cHeader?.title && (
            <h4 className="title">
              {Icon && (
                <>
                  <Icon />
                  &nbsp;
                </>
              )}
              <span>{cHeader.title}</span>
            </h4>
          )}
          {cHeader?.descrp && <p className="descrp">{cHeader.descrp}</p>}
          {cHeader?.tags && (
            <div className="tags">
              {cHeader.tags.map((tag, tagKey) => (
                <p
                  key={tagKey}
                  className={`tag tag_${Number(tagKey) + 1} ${tag.label} ${tag.attr}`}
                >
                  <strong>{tag.value}</strong>
                  {tag?.ext && <span>&nbsp;{tag.ext}</span>}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
      {cBody && (
        <div className="card-details card-body">
          {cBody?.title && <h4 className="title">{cBody.title}</h4>}
          {cBody?.descrp && <p className="descrp">{cBody.descrp}</p>}
          {cBody?.context && (
            <div className="sums meta-sums">
              {cBody.context.map((lblnv, lblnvKey) => (
                <p key={lblnvKey} className={`sum sum-${Number(lblnvKey) + 1}`}>
                  <span className="label">{lblnv.label}</span>
                  <span className="value">{lblnv.value}</span>
                </p>
              ))}
            </div>
          )}
          {cBody?.children && <>{cBody.children}</>}
        </div>
      )}
      {cFooter && (
        <div className="card-details card-footer">
          {cFooter?.title && <h4 className="title">{cFooter.title}</h4>}
          {cFooter?.descrp && <p className="descrp">{cFooter.descrp}</p>}
          {cFooter?.context && (
            <div className="sums dependency-sums">
              {cFooter.context.map((dpncy, dpncyKey) => (
                <p key={dpncyKey} className={`sum sum-${Number(dpncyKey) + 1}`}>
                  <span className="label">{dpncy.label}</span>
                  <span className="value">{dpncy.value}</span>
                </p>
              ))}
            </div>
          )}
          {cFooter?.children && <>{cFooter.children}</>}
        </div>
      )}
    </div>
  );
};

export const User = ({
  cmpID,
  styleObj,
  memberObj,
  rootElement,
  className,
  skeletonTimeOut,
}: LocalContainerProps & {
  memberObj: {
    avatar: string;
    name: string;
    role?: string;
    url?: string;
    descrp?: string;
  };
}) => {
  const [preLoading, setPreLoading] = useState(skeletonTimeOut && skeletonTimeOut > 0);
  const cmpStyles = SetComponentStyles({ className, styleObj });
  const RootElement: React.ElementType = (memberObj.url ? "a" : rootElement) || "div";
  const { avatar, name, role, url, descrp } = memberObj;

  useEffect(() => {
    const renderAnimation = async () => {
      if (preLoading && skeletonTimeOut) {
        await operationHold(skeletonTimeOut);
      }

      setPreLoading(false);
    };

    renderAnimation();
  }, []);

  if (preLoading) {
    return (
      <RootElement
        {...(cmpID && { id: cmpID })}
        {...(cmpStyles && { className: `${cmpStyles}${descrp ? " described" : ""}` })}
        {...(url && {
          href: url,
          target: "_blank",
        })}
      >
        <div className="card-top">
          <SkeletonPlaceholder
            styleObj={{
              cmpTag: "sklt",
              cmpStyles: ["dp", "sklt-dp"],
            }}
            className="dp sklt-dp"
            variant="circular"
            width={80}
            height={80}
          />
          <SkeletonPlaceholder
            styleObj={{
              cmpTag: "sklt",
              cmpStyles: ["username", "sklt-username"],
            }}
            variant="rectangular"
            width={180}
            height={18}
          />
          <SkeletonPlaceholder
            styleObj={{
              cmpTag: "sklt",
              cmpStyles: ["userrole", "sklt-userrole"],
            }}
            variant="rectangular"
            width={120}
            height={14}
          />
        </div>
      </RootElement>
    );
  }

  return (
    <RootElement
      {...(cmpID && { id: cmpID })}
      {...(cmpStyles && { className: `${cmpStyles}${descrp ? " described" : ""}` })}
      {...(url && {
        href: url,
        target: "_blank",
      })}
    >
      <div className="card-top">
        <img src={avatar || ""} alt={`display-profile-${name}`} />
        <p className="username">{name}</p>
        <p className="userrole">{role}</p>
        {descrp && (
          <span className="expander">
            <FaArrowTrendUp />
          </span>
        )}
      </div>
      {descrp && (
        <div className="card-bottom">
          <p className="details">{descrp}</p>
        </div>
      )}
    </RootElement>
  );
};
